import React, {useCallback, useEffect, useState, useRef} from 'react'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import {useHttp} from "../../../hooks/http.hook";
import moment from "moment";

export const PageSupervisor = () => {
    const {loading, request} = useHttp()

    const elemModal = useRef();
    const elemColl = useRef();
    const priorityRef = useRef();
    const elemSort = useRef();
    const statusRef = useRef();
    const deadlineRef = useRef();
    const dateCreateRef = useRef();
    const btnRef = useRef();
    const formRef = useRef();
    const bodyUpdTask = useRef();
    const titleRef = useRef();
    const descriptionRef = useRef();
    const responsibleRef = useRef();
    const options = useRef();
    const optionsDeadline = useRef();
    const optionsDateCreate = useRef();
    const urlTask = useRef();
    const idRef = useRef();

    const [clickQuery, setClickQuery] = useState(null);
    const [showResponsible, setShowResponsible] = useState(true);

    options.current = {
        inDuration: 250,
        outDuration: 250,
        opacity: 0.5,
        dismissible: false,
        startingTop: "4%",
        endingTop: "10%"
    };

    const deadlineClose = useCallback(() => {
        deadlineRef.current.value=moment(deadlineRef.current.value).format('YYYY-MM-DD HH:mm:ss');
        formRef.current['deadline']=deadlineRef.current.value;
    }, [])

    const dateCreateClose = useCallback(() => {
        dateCreateRef.current.value=moment(dateCreateRef.current.value).format('YYYY-MM-DD HH:mm:ss');
        formRef.current['createdAt']=dateCreateRef.current.value
    }, [])

    optionsDeadline.current = {
        onClose: deadlineClose
    };

    optionsDateCreate.current = {
        onClose: dateCreateClose
    };

    bodyUpdTask.current=JSON.stringify({"values": [localStorage.login], "keys":['creator'], "attr": {include:[],exclude:[]}});

    const [task, setTask] = useState([]);
    const [responsible, setResponsible] = useState([]);

    const selectedTask = async (event) => {
        console.log('event.target.value',event.target.value)
        setShowResponsible(false)
        btnRef.current.innerHTML='Изменить'
        idRef.current=event.target.value
        const body = JSON.stringify({"values": [event.target.value], "keys":['id'], "attr": {include:[],exclude:[]}})
        query('/api/task/get/', body).then(res => {
            let resultForm=[];
            res.forEach(val => {
                resultForm.push(val)
                titleRef.current.value=val.title
                descriptionRef.current.value=val.description
                dateCreateRef.current.value=moment(val.createdAt).format('YYYY-MM-DD HH:mm:ss')
                deadlineRef.current.value=moment(val.deadline).format('YYYY-MM-DD HH:mm:ss')
                priorityRef.current.value=val.priority
                statusRef.current.value=val.status
            })

            formRef.current = resultForm[0]
            setClickQuery(()=>changeTask)
        })
    }
    const query = async (url,body) => {
        try {
            const method = 'POST'
            const headers = {'Content-Type': 'application/json'}
            return await request(url, {method, body, headers})
        } catch (e) {}
    }

    const changeHandler = (event) => {
        console.log(formRef.current,event.target.name, event.target.value)
        formRef.current[event.target.name]=event.target.value;
    }

    const formTasksResponsible = (event) => {
        if(event.target.selectedOptions[0].index!==0){
            setTask([])
            updateTask(JSON.stringify({"values": [localStorage.login,event.target.selectedOptions[0].label], "keys":['creator','responsible'], "attr": {include:[],exclude:[]}}))
        } else {
            updateTask(bodyUpdTask.current)
        }
    }

    const updateTask = (body) => {
        setTask([])
        query('/api/task/get/',body).then(res => {
            res.forEach(from => {
                let sl = null;
                if(from.status==='К выполнению' || from.status==='Отмена'){
                    sl={color:'#808080'}
                } else {
                    if(from.status==='Выполняется'){
                        sl={color:'#d50101'}
                    } else {
                        if(from.status==='Выполнено'){
                            sl={color:'#41d773'}
                        }
                    }
                }
                setTask(prev => [...prev, (
                    <li key={from.id}>
                        <div className='att'><div className="collapsible-header"><i style={sl} className='material-icons'>{from.title}</i></div><div className='button'><button value={from.id} onClick={selectedTask} className="edit waves-effect waves-light btn modal-trigger" data-target="modal1">✎</button></div></div>
                        <div className="collapsible-body">
                            <span>Описание: {from.description}</span><br/>
                            <span>Приоритет: {from.priority}</span><br/>
                            <span>Дедлайн: {moment(from.deadline).format('YYYY-MM-DD HH:mm:ss')}</span><br/>
                            <span>Ответственный: {from.responsible}</span><br/>
                            <span>Статус: {from.status}</span><br/>
                        </div>
                    </li>
                )]);
            })
        })
    }

    const updateResponsible = () => {
        setResponsible([])
        const body = JSON.stringify({"values": [localStorage.login], "keys":['creator'], "attr": ['responsible']})
        query('/api/task/get/',body).then(res => {
            let val = [];
            res.forEach(v =>{
                val.push(v.responsible)
            })
            new Set(val).forEach((from, i) => {
                setResponsible(prev => [...prev, (
                    <option key={i} value={from}>{from}</option>
                )]);
            })
        })
    }

    useEffect(() => {
        updateTask(bodyUpdTask.current)
        updateResponsible()
    }, [])

    useEffect(() => {
        M.FormSelect.init(elemSort.current, null);
    }, [responsible])

    const createTask = async () => {
        await query(urlTask.current, JSON.stringify({...formRef.current}))
        updateTask(bodyUpdTask.current)
        updateResponsible()
    }

    const changeTask = async () => {
        const body = JSON.stringify({"obj": {...formRef.current},"values": [idRef.current], "keys":['id']})
        await query('/api/task/update', body)
        updateTask(bodyUpdTask.current)
        updateResponsible()
    }

    const formTask = () => {
        return (
            <div className="row-modal">
                <div className="col"></div>
                    <div className="card-content">
                        <div className="fields">
                            <div className="input-field">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Название"
                                    onChange={changeHandler}
                                    ref={titleRef}/>
                            </div>
                            <div className="input-field">
                                <textarea
                                    type="text"
                                    name="description"
                                    placeholder="Описание"
                                    onChange={changeHandler}
                                    ref={descriptionRef}
                                />
                            </div>
                            {showResponsible && (<div className="input-field">
                                <input
                                    type="text"
                                    name="responsible"
                                    placeholder="Исполнитель (login)"
                                    onChange={changeHandler}
                                    ref={responsibleRef}
                                />
                            </div>)}
                            <div className="input-field">
                                <input ref={dateCreateRef} onChange={changeHandler} name='deadline' placeholder="Дата создания" type="text" className="datepicker"/>
                            </div>
                            <div className="input-field">
                                <input ref={deadlineRef} onChange={changeHandler} name='deadline' placeholder="Крайний срок" type="text" className="datepicker"/>
                            </div>
                            <label>Приоритет</label>
                            <div className="input-field col s12">
                                <select ref={priorityRef} name="priority" onChange={changeHandler}>
                                    <option value="Низкий">Низкий</option>
                                    <option value="Средний">Средний</option>
                                    <option value="Высокий">Высокий</option>
                                </select>
                            </div>
                            <label>Статус</label>
                            <div className="input-field col s12">
                                <select ref={statusRef} name="status" onChange={changeHandler}>
                                    <option value="К выполнению">К выполнению</option>
                                    <option value="Выполняется">Выполняется</option>
                                    <option value="Выполнено">Выполнено</option>
                                    <option value="Отмена">Отмена</option>
                                </select>
                            </div>
                        </div>
                    </div>
            </div>
        )
    }

    const newTask = () => {
        btnRef.current.innerHTML='Создать'
        urlTask.current = '/api/task/create'
        setClickQuery(()=>createTask)
        formRef.current = {
            title:'',
            description:'',
            createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            deadline: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            responsible:'',
            priority:'Низкий',
            status:'К выполнению',
            creator: localStorage.login
        };
        titleRef.current.value=formRef.current.title
        descriptionRef.current.value=formRef.current.description
        dateCreateRef.current.value=formRef.current.createdAt
        deadlineRef.current.value=formRef.current.deadline
        if (showResponsible===false){
            setShowResponsible(true)
        } else {
            responsibleRef.current.value=formRef.current.responsible
        }

    }

    const elements = () => {
        return (
            <>
                <div className="control-bar">
                    <button onClick={newTask} className="waves-effect waves-light btn modal-trigger" data-target="modal1">Новая задача</button>
                    <select name='responsible' onChange={formTasksResponsible} ref={elemSort}>
                        <option value="Низкий">Все исполнители</option>
                        {responsible}
                    </select>
                </div>
                <div id="modal1" className="modal" ref={elemModal}>
                    <div className="modal-cont">
                        {formTask()}
                    </div>
                    <div className="modal-footer">
                        <button className="modal-close waves-effect waves-red btn-flat">Отмена</button>
                        <button ref={btnRef} onClick={()=>clickQuery()} disabled={loading} className="modal-close waves-effect waves-green btn-flat"></button>
                    </div>
                </div>
                <ul className="collapsible" ref={elemColl}>
                    {
                        task
                    }
                </ul>
            </>
        )
    }

    useEffect(() => {
        M.Modal.init(elemModal.current, options.current);
        M.Collapsible.init(elemColl.current, options.current);
        M.Datepicker.init(dateCreateRef.current, optionsDateCreate.current);
        M.Datepicker.init(deadlineRef.current, optionsDeadline.current);
        M.FormSelect.init(priorityRef.current, null);
        M.FormSelect.init(statusRef.current, null);
    }, [])

    return (
        elements()
    )
}