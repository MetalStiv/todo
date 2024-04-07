export interface ITodoState {
    todos: string[],
    isFetching: boolean
}

const defaultState: ITodoState = {
    todos: [],
    isFetching: false
}

export const ADD_TODO: string = 'ADD_TODO';
export const DELETE_TODO: string = 'DELETE_TODO';

export type ActionType = typeof ADD_TODO | typeof DELETE_TODO;

export interface IAction {
    type: ActionType,
    payload: string,
}

export default function reposReducer(state = defaultState, action: IAction): ITodoState{
    switch(action.type){
        case ADD_TODO:
            return {
                ...state,
                todos: [...state.todos, action.payload]
            };
        default:
            return state;
    }
}