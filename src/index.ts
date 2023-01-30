const message: string = "test";
console.log(message);

// ジェネリクスサンプル
type Human<T> = {
    name: T;
}

const typeTest: Human<string> = { name: 'test' };

class Success<T> {
  readonly payload: T;

  constructor(payload: T) {
      this.payload = payload;
    }
}

type ErrorPayload = {
  messages: string[];
};

class Failure<T = ErrorPayload> {
  readonly payload: T;

  constructor(payload: T) {
      this.payload = payload;
    }
}

type MutationResult<T = undefined, S = ErrorPayload> =
    | Success<T>
    | Failure<S>;

// 省略なし構文。OK。
const mutation: MutationResult<boolean> = new Success<boolean>(true);
// 型引数推論が走るから大丈夫。OK。
const mutation2: MutationResult<boolean> = new Success(true);
// Failureの型はデフォルト引数があるので省略してもエラーにはならない。OK。
const mutation3: MutationResult<boolean> = new Failure({ messages: ['test message'] });

// 型判定が変わってエラーになるようになった？？
// でも確かに普通に構文解釈すると<true>はおかしい。NG。
const mutation4: MutationResult<true> = new Success(true);

// こっちは通る。Failureの時はMutationResultの第一型引数は利用しないから？？OK。
const mutation5: MutationResult<true> = new Failure({ messages: ['test message'] });
// これも上記と同じ。第一型引数は使わないから関係ないのか？。OK
const mutation6: MutationResult = new Failure({ messages: ['test message'] });

// NG。どうも`true`は型引数推論してくれない？booleanにならない？
const mutation7: MutationResult = new Success(true);

