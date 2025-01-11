import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "./AppProvider";


function Todo({ content, todo, done, setTodo, setDone }) {
    const { tasks, setTasks, moveToEnd, page } = useAppContext();
    const [editable, setEditable] = useState(false); //用於管理事項內容是否可編輯
    const doneRef = useRef(); //用於追蹤最新的done
    const divContentRef = useRef(); //用於追蹤正在編輯代辦/完成事項的div容器

    //監聽done變化並保存，後續使用doneRef.current作為函式中的邏輯篩選對象，避免直接使用done
    //原因: setDone屬於非同步處理，函式中調用的done進行邏輯篩選時，如果done的變化本身不觸發渲染，那麼函式調用的done會是觸發setDone前的狀態內容
    useEffect(() => {
        doneRef.current = done;
        const newTasks = {...tasks};
        newTasks[page].done = done;
        setTasks(newTasks);
    }, [done])

    useEffect(() => {
        if (editable && divContentRef.current) {
            divContentRef.current.focus();
        }
    }, [editable]);




    //處理代辦事件順序交換(hint: todo中不包含done的事項)
    //思路: 找尋兩個事項的index，將事項寫成變數保存，利用todo副本進行數值交換操作再存成todo
    const handleChangeOrder = (content, delta) => {
        const newTodo = [...todo];
        const contentIndex = newTodo.findIndex(item => item === content); //當前待辦事項index
        const currentContent = newTodo[contentIndex]; 
        let targetIndex = contentIndex + delta; //當前將與待辦事項交換位置的事項index
        let targetContext = newTodo[targetIndex]
        
        //用於Move done things to end功能開啟時，能夠正常交換代辦事項的順序
        while(done.includes(targetContext) && moveToEnd) {
            targetIndex += delta;
            targetContext = newTodo[targetIndex];
        }

        if (targetIndex < 0) {
            alert("It's the first thing in the todolist!");
        }
        else if (targetIndex >= newTodo.length) {
            alert("It's the last thing in the todolist!");
        }
        else {
            newTodo[targetIndex] = currentContent;
            newTodo[contentIndex] = targetContext;
            setTodo(newTodo);
        }

    }

    //處理完成事項標示
    //思路: 當點擊完成待辦事項按鈕後，依據done中是否存在該待辦事項，將待辦事項移入/移出done，再利用done作為以下JSX中的三元運算子依據，進而改變樣式
    const handleDoneMark = (content) => {
        if (doneRef.current.includes(content)) {
            const newDone = doneRef.current.filter(item => item !== content);
            setDone(newDone);
        }
        else {
            setDone(state => [...state, content]);
        }
    }

    //處理編輯待辦/完成事項按鈕
    const handleEditable = () => {
        setEditable(prevState => !prevState);
    }

    //處理編輯待辦/完成事項內容(hint: 同時存在於done的內容必續被同時處理)
    const handleContentChange = (content) => {
        const updatedContent = divContentRef.current.innerText;

        const index = todo.findIndex(item => item === content);
        const newTodo = [...todo];
        newTodo[index] = updatedContent;
        setTodo(newTodo);

        if (done.includes(content)) {
            const index = done.findIndex(item => item === content);
            const newDone = [...done];
            newDone[index] = updatedContent;
            setDone(newDone);
        }
    }

    //處理編輯待辦/完成事項內容後的鍵盤輸入邏輯
    const handleKeyDown = (e, content) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleContentChange(content);
            handleEditable();
        }
    }


    //處理刪除待辦/完成事項
    //思路: 當點擊刪除待辦/完成事項按鈕，應該將該事項從todo、done中刪除 
    const handleDeleteTodo = (content) => {
        const newTodo = todo.filter(item => item !== content);
        setTodo(newTodo);
        if (doneRef.current.includes(content)) {
            const newDone = doneRef.current.filter(item => item !== content);
            setDone(newDone);
        }
    }

    return (
        <div className="border-l-[5px] border-primary rounded-md mb-2 relative group opacity-85">
            {/*次要功能區塊: 順序交換按鈕*/}
            <div className="absolute flex flex-col justify-between items-center -left-1 w-[4px] h-full rounded-l-md bg-primary group-hover:w-[24px] group-hover:-left-6 transition-all duration-300">
                {/*思路: 如果代辦事項本身存在於done中，就不需要顯示順序交換按鈕*/}
                {(moveToEnd && done.includes(content)) ?
                    ""
                    :
                    <>
                        {/*事項上移*/}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="white"
                            className="size-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer "
                            onClick={() => handleChangeOrder(content, -1)}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>

                        {/*事項下移*/}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="white"
                            className="size-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:cursor-pointer "
                            onClick={() => handleChangeOrder(content, +1)}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </>
                }

            </div>

            {/*主要功能區塊*/}
            <div className="grid grid-cols-10 grid-rows-1 grid-flow-row gap-2 items-center bg-white p-4 rounded-r-md">

                {/*完成待辦事項按鈕*/}
                <button className={` col-span-1 flex items-center justify-center rounded-md w-5 h-5 
                        ${done.includes(content) ? "bg-primary" : "border border-secondary"}`}
                    onClick={() => handleDoneMark(content)}>
                    <svg id={`${content}-done-mark`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3.0} stroke="white"
                        className={`size-5 ${done.includes(content) ? "block" : "hidden"}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </button>

                {/*待辦事項名稱*/}
                <div className={` col-span-7 break-words text-start text-lg font-medium ${done.includes(content) ? "line-through" : ""}`}
                    ref={divContentRef}
                    contentEditable={editable}
                    suppressContentEditableWarning={true}
                    onBlur={() => handleContentChange(content)}
                    onKeyDown={e => handleKeyDown(e, content)}>
                    {content}
                </div>


                {/*編輯待辦事項*/}
                <button className=" col-span-1" onClick={() => handleEditable()}>
                    {editable ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ccc7e3" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="#ccc7e3" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    }
                </button>

                {/*刪除待辦事項按鈕*/}
                <button onClick={() => handleDeleteTodo(content)} className="w-6 h-6 col-span-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ccc7e3" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

            </div>

        </div>
    )
}

export default Todo;