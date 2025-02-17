abstract class BaseError extends Error {
  public readonly type: string
  public readonly cause: Error
  public readonly message: string

  constructor({
    type,
    cause,
    message,
  }: {
    type: string
    cause: Error
    message: string
  }) {
    super()
    this.cause = cause
    this.message = message
    this.type = type
  }
}

export class BadTypeError extends BaseError {
  constructor(message?: string, error?: Error) {
    super({
      message: message || 'Error Decoding Type',
      type: 'BAD_TYPE_ERROR',
      cause: error || new Error('Error Decoding Type'),
    })
  }
}
