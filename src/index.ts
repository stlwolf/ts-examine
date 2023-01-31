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

type Result<T = undefined, S = ErrorPayload> =
    | Success<T>
    | Failure<S>;

// 省略なし構文。OK。
const mutation: Result<boolean> = new Success<boolean>(true);
// 型引数推論が走るから大丈夫。OK。
const mutation2: Result<boolean> = new Success(true);
// Failureの型はデフォルト引数があるので省略してもエラーにはならない。OK。
const mutation3: Result<boolean> = new Failure({ messages: ['test message'] });

// 型判定が変わってエラーになるようになった？？
// でも確かに普通に構文解釈すると<true>はおかしい。NG。
const mutation4: Result<true> = new Success(true);

// こっちは通る。Failureの時はResultの第一型引数は利用しないから？？OK。
const mutation5: Result<true> = new Failure({ messages: ['test message'] });
// これも上記と同じ。第一型引数は使わないから関係ないのか？。OK
const mutation6: Result = new Failure({ messages: ['test message'] });

// NG。どうも`true`は型引数推論してくれない？booleanにならない？
const mutation7: Result = new Success(true);

const okFunc = async (flag: boolean): Promise<Result<boolean>> => {
  if (flag) {
      return new Success(true);
  }
  return new Failure({ messages: ['error message'] });
};

// ts 3.6.4 だと通るが、4.2.4だとビルドエラーになる
const errFunc = async (flag: boolean): Promise<Result<true>> => {
  if (flag) {
      return new Success(true);
  }
  return new Failure({ messages: ['error message'] });
};


