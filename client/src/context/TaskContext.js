import {createContext} from 'react'

function noop() {}

export const TaskContext = createContext({
    title:null,
    description:null,
    deadline:null,
    priority:null,
    status: null,
    responsible: null,
    creator:null,
    create: noop,
    update: noop
})