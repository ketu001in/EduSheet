// A safe, hand-written recursive-descent math expression parser/evaluator
// for the Graphing Calculator's real-time typed-input mode -- deliberately
// NOT `eval()` or `new Function()` (which would let arbitrary JS run from
// a text box). Standard operator precedence (^ binds tighter than * and /,
// which bind tighter than + and -; ^ is right-associative; unary minus
// binds LOOSER than ^, so "-2^2" is -(2^2) = -4, the standard math
// convention, not (-2)^2 = 4). Multiplication must be explicit ("2*x", not
// "2x") -- a deliberate simplicity/predictability tradeoff, not an
// oversight; the UI's example presets show the expected syntax.
//
// Every operator/function/constant here is exhaustively unit-tested
// against hand-computed values (including precedence edge cases like
// 2^3^2 = 512 and 2^-2 = 0.25) in a throwaway Node script before this file
// was written -- see the PR description for the full pass/fail table.

export type ExprScope = Record<string, number>;

const FUNCS: Record<string, (...args: number[]) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  sqrt: Math.sqrt, abs: Math.abs,
  log: Math.log10, ln: Math.log, exp: Math.exp,
};
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };

type Token =
  | { type: 'NUMBER'; value: number }
  | { type: 'IDENT'; value: string }
  | { type: '+' | '-' | '*' | '/' | '^' | '(' | ')' | ',' | 'EOF' };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const text = src.slice(i, j);
      if ((text.match(/\./g) || []).length > 1) throw new Error(`Invalid number "${text}"`);
      tokens.push({ type: 'NUMBER', value: parseFloat(text) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9]/.test(src[j])) j++;
      tokens.push({ type: 'IDENT', value: src.slice(i, j) });
      i = j;
      continue;
    }
    if ('+-*/^(),'.includes(c)) {
      tokens.push({ type: c as '+' | '-' | '*' | '/' | '^' | '(' | ')' | ',' });
      i++;
      continue;
    }
    throw new Error(`Unexpected character "${c}"`);
  }
  tokens.push({ type: 'EOF' });
  return tokens;
}

type Node =
  | { type: 'num'; value: number }
  | { type: 'neg'; arg: Node }
  | { type: 'ident'; name: string }
  | { type: 'call'; name: string; args: Node[] }
  | { type: 'bin'; op: '+' | '-' | '*' | '/' | '^'; left: Node; right: Node };

function parse(tokens: Token[]): Node {
  let pos = 0;
  const peek = () => tokens[pos];
  const eat = (type: Token['type']) => {
    const t = tokens[pos];
    if (t.type !== type) throw new Error(`Expected "${type}" but got "${t.type}"`);
    pos++;
    return t;
  };

  function parseExpr(): Node {
    let node = parseTerm();
    while (peek().type === '+' || peek().type === '-') {
      const op = eat(peek().type).type as '+' | '-';
      node = { type: 'bin', op, left: node, right: parseTerm() };
    }
    return node;
  }
  function parseTerm(): Node {
    let node = parseUnary();
    while (peek().type === '*' || peek().type === '/') {
      const op = eat(peek().type).type as '*' | '/';
      node = { type: 'bin', op, left: node, right: parseUnary() };
    }
    return node;
  }
  function parseUnary(): Node {
    if (peek().type === '-') { eat('-'); return { type: 'neg', arg: parseUnary() }; }
    if (peek().type === '+') { eat('+'); return parseUnary(); }
    return parsePower();
  }
  function parsePower(): Node {
    const base = parsePrimary();
    if (peek().type === '^') {
      eat('^');
      return { type: 'bin', op: '^', left: base, right: parseUnary() }; // right-assoc, allows 2^-2
    }
    return base;
  }
  function parsePrimary(): Node {
    const t = peek();
    if (t.type === 'NUMBER') { eat('NUMBER'); return { type: 'num', value: t.value }; }
    if (t.type === '(') {
      eat('(');
      const node = parseExpr();
      eat(')');
      return node;
    }
    if (t.type === 'IDENT') {
      eat('IDENT');
      const name = t.value;
      if (peek().type === '(') {
        eat('(');
        const args = [parseExpr()];
        while (peek().type === ',') { eat(','); args.push(parseExpr()); }
        eat(')');
        return { type: 'call', name, args };
      }
      return { type: 'ident', name };
    }
    throw new Error(`Unexpected token "${t.type}"`);
  }

  const result = parseExpr();
  if (peek().type !== 'EOF') throw new Error(`Unexpected trailing input near "${peek().type}"`);
  return result;
}

function evaluate(node: Node, scope: ExprScope): number {
  switch (node.type) {
    case 'num': return node.value;
    case 'neg': return -evaluate(node.arg, scope);
    case 'ident': {
      if (node.name in scope) return scope[node.name];
      if (node.name in CONSTS) return CONSTS[node.name];
      throw new Error(`Unknown identifier "${node.name}"`);
    }
    case 'call': {
      const fn = FUNCS[node.name];
      if (!fn) throw new Error(`Unknown function "${node.name}"`);
      return fn(...node.args.map((a) => evaluate(a, scope)));
    }
    case 'bin': {
      const l = evaluate(node.left, scope);
      const r = evaluate(node.right, scope);
      switch (node.op) {
        case '+': return l + r;
        case '-': return l - r;
        case '*': return l * r;
        case '/': return l / r;
        case '^': return Math.pow(l, r);
      }
    }
  }
}

// Compiles a source string into a reusable (scope) => number function.
// Throws a descriptive Error on any syntax problem -- callers (the live
// graphing UI) catch this and show a friendly inline message instead of
// crashing the plot.
export function compileExpression(src: string): (scope: ExprScope) => number {
  const ast = parse(tokenize(src));
  return (scope: ExprScope) => evaluate(ast, scope);
}
