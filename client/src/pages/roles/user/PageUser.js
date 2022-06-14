import React, {useCallback, useEffect, useRef, useState} from 'react'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import {useHttp} from "../../../hooks/http.hook";
import moment from "moment";

export const PageUser = () => {
    const {loading, request} = useHttp()

    const elemModal = useRef();
    const elemColl = useRef();
    const elemSort = useRef();
    const statusRef = useRef();

    const dateRef = useRef();
    const btnRef = useRef();
    const formRef = useRef();
    const bodyUpdTask = useRef();
    const options = useRef();
    const optionsDate = useRef();
    const idRef = useRef();

    const [clickQuery, setClickQuery] = useState(null);

    options.current = {
        inDuration: 250,
        outDuration: 250,
        opacity: 0.5,
        dismissible: false,
        startingTop: "4%",
        endingTop: "10%"
    };

    const dateClose = useCallback(() => {
        formRef.current['deadline']=dateRef.current.value;
    }, [])

    optionsDate.current = {
        format: "dd.mm.yyyy",
        onClose: dateClose
    };

    bodyUpdTask.current=JSON.stringify({"values": [localStorage.login], "keys":['responsible'], "attr": {include:[],exclude:[]}});

    const [task, setTask] = useState([]);

    const selectedTask = async (event) => {
        console.log('event.target.value',event.target.value)
        btnRef.current.innerHTML='Изменить'
        idRef.current=event.target.value
        const body = JSON.stringify({"values": [event.target.value], "keys":['id'], "attr": {include:[],exclude:[]}})
        query('/api/task/get/', body).then(res => {
            let resultForm=[];
            res.forEach(val => {
                resultForm.push(val)
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

    const sortTask = (event) => {
        console.log(event.target.selectedOptions[0].value)
        if(event.target.selectedOptions[0].value==='Текущий день' ) {
            const START=moment().format('YYYY-MM-DD 00:00')
            const END=moment().format('YYYY-MM-DD 23:59')
            updateTask('/api/task/getdr/',JSON.stringify({"start":START,"end":END,"values": [localStorage.login], "keys":['responsible'], "attr": {include:[],exclude:[]}}))
        } else {
            if(event.target.selectedOptions[0].value==='За неделю' ) {
                const START=moment().format('YYYY-MM-DD 00:00')
                const END=moment().add(7, 'days').format('YYYY-MM-DD 23:59');
                updateTask('/api/task/getdr/',JSON.stringify({"start":START,"end":END,"values": [localStorage.login], "keys":['responsible'], "attr": {include:[],exclude:[]}}))
            } else {
                if(event.target.selectedOptions[0].value==='Все' ) {
                    updateTask('/api/task/get/',bodyUpdTask.current)
                }
            }
        }
    }

    const updateTask = (url,body) => {
        setTask([])
        query(url,body).then(res => {
            res.forEach(from => {
                let sl = {};
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
                            <span>Дедлайн: {moment(from.deadline).format('DD.MM.YYYY')}</span><br/>
                            <span>Ответственный: {from.responsible}</span><br/>
                            <span>Статус: {from.status}</span><br/>
                        </div>
                    </li>
                )]);
            })
        })
    }

    useEffect(() => {
        updateTask('/api/task/get/',bodyUpdTask.current)
    }, [])

    const changeTask = async () => {
        const body = JSON.stringify({"obj": {...formRef.current},"values": [idRef.current], "keys":['id']})
        await query('/api/task/update', body)
        updateTask('/api/task/get/', bodyUpdTask.current)
    }


    const formTask = () => {
        return (
            <div className="row-modal">
                <div className="col"></div>
                <div className="card-content">
                    <div className="fields">
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

    const elements = () => {
        return (
            <>
                <div className="control-bar">
                    <select name='responsible' onChange={sortTask} ref={elemSort}>
                        <option value="Все">Все</option>
                        <option value="Текущий день">Текущий день</option>
                        <option value="За неделю">За неделю</option>
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
        M.Datepicker.init(dateRef.current, optionsDate.current);
        M.FormSelect.init(elemSort.current, null);
        M.FormSelect.init(statusRef.current, null);
    }, [])

    return (
        elements()
    )
}