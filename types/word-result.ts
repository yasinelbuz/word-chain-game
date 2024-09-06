

export type ErrorResult = {
  error: string;
};

export interface IWordResult {
  yazim_id: string
  sozu: string
  ekler: string
  seskod: string
}

export type IWordResultArray = IWordResult[]


export interface IwordList {
    word :string,
    isRight:boolean
}

export type IwordListArray = IwordList[]

export type ApiResponse = IWordResultArray | ErrorResult;