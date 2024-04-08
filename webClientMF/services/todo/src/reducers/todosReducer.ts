export interface ITodoState {
    todos: string[],
    isFetching: boolean
}

const defaultState: ITodoState = {
    todos: [],
    isFetching: false
}

export enum ActionTypeEnum {
    ADD_TODO = 'ADD_TODO',
    DELETE_TODO = 'DELETE_TODO'
};

export interface IAction {
    type: ActionTypeEnum,
    payload: string,
}

export default function todosReducer(state = defaultState, action: IAction): ITodoState{
    switch(action.type){
        case ActionTypeEnum.ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload]
            };
        default:
            return state;
    }
}