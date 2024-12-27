import React, { useEffect, useMemo, useRef, useState } from "react";
import Todo from "./Todo";
import { useAppContext } from "./AppProvider";

function Dashboard() {
    const [matter, setMatter] = useState("");  //保存Input的onChange內容
    const divUnderTodo = useRef(); //用於在待辦事件下生成空div以利後續scrollbar定位
    const inputOfListName = useRef(); //用來操作清單名稱input
    const [readOnly, setReadOnly] = useState(true); //用於管理清單名稱可否被編輯
    const { todo, setTodo, done, setDone, listName, setListName, moveToEnd, setMoveToEnd } = useAppContext();

    //監聽todo變化以定位scrollbar到新增的待辦事項
    useEffect(() => {
        if (divUnderTodo.current) {
            divUnderTodo.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [todo]);

    //監聽todo/done變化以產生進度條數據
    const progress = useMemo(() => {
        return todo.length === 0 ? 0 : Math.floor((done.length / todo.length) * 100);
    }, [todo, done])

    //監聽readOnly變化，尤其注意readOnly為false時，應該確保存取該次的修改內容
    useEffect(() => {
        if (!readOnly && inputOfListName.current) {
            inputOfListName.current.focus();
            inputOfListName.current.select();
        }
        else if (readOnly && inputOfListName.current) {
            inputOfListName.current.blur();
        }
    }, [readOnly])






    //處理重新命名事項清單與否
    const handleListNamereadOnly = () => {
        setReadOnly(prevState => !prevState);
    }
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleListNamereadOnly();
        }
    }

    //處理新增待辦事項
    const handleAddTodo = (e) => {
        //避免form submit的自動刷新頁面
        if (e) e.preventDefault();
        if (!matter) return;
        //避免重複添加相同待辦事項
        if (!todo.includes(matter)) {
            setTodo(state => [...state, matter]);
        }
        else {
            alert("It's already exist in the list!");
        }
        //重置Input方便連續添加事項
        setMatter("");
    }

    const handleResetTodolist = () => {
        setTodo([]);
        setDone([]);
        setListName("");
        sessionStorage.removeItem("storageTitle");
    }


    //處理待辦事項渲染邏輯，分為是否啟動"Move done things to end"兩種狀況
    const renderTodo = () => {
        if (moveToEnd) {
            //顯示待辦事項，已完成的事項移至底部 
            //思路: 藉由done來篩選原來的todo，形成不含有完成事項的todo (hint: 原來todo有包含待辦與完成事項)
            return (
                <>
                    {todo.filter((item) => !done.includes(item)).map((item) => (
                        <Todo key={item} content={item} />
                    ))}
                    <div ref={divUnderTodo} className="h-[1px]" />
                    {done.map((item) => (
                        <Todo key={item} content={item} />
                    ))}
                </>
            );
        }
        else {
            return (
                <>
                    {todo.map((item) => <Todo key={item} content={item} />)}
                    <div ref={divUnderTodo} />
                </>
            )
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-[500px] h-[700px] flex flex-col text-tertiary bg-gradient-to-b from-[#eef7fe] to-[#ecedff]">

                {/*Logo與待辦事項清單名稱*/}
                <div className="text-left mx-8  mt-10 border-b-2 border-border">
                    <h1 className=" text-3xl">Todo List</h1>
                    <p className="mb-4 text-sm">Add things to do</p>
                    {/*待辦事項清單名稱*/}
                    <div className="group inline-block relative">
                        <input
                            ref={inputOfListName}
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            onKeyDown={e => handleKeyDown(e)}
                            className={`w-[100px] border-2 border-border border-b-[#eef7fe] ml-2 -mb-1 p-1 pb-0 rounded-t-md hover:cursor-pointer ${readOnly ? "bg-transparent" : ""}`}
                            readOnly={readOnly}
                            placeholder="Untitle List..." />
                        {/*編輯名稱按鈕*/}
                        <div className={`absolute top-1 -right-6 cursor-pointer w-5 h-5 bg-primary rounded-full flex items-center justify-center
                                transition-all duration-500 opacity-0 group-hover:opacity-100`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="white" 
                                className="size-4"
                                 onClick={() => handleListNamereadOnly()}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </div>
                        {/*完成名稱編輯按鈕*/}
                        <div className={`absolute top-1 -right-6 cursor-pointer w-5 h-5 bg-primary rounded-full flex items-center justify-center
                                transition-all duration-500 ${readOnly ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white"
                                className="size-4"
                                onClick={() => handleListNamereadOnly()}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </div>
                    </div>
                </div>


                {/*進度條*/}
                <div className="mx-8 my-2 text-lg">
                    {todo.length !== 0 && (
                        <div className="flex items-center gap-1">
                            <p className=" w-12">{progress}%</p>
                            <div className="w-full h-4 bg-white rounded-md">
                                <div className="bg-[#9ab2f8] h-full rounded-md" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/*代辦事項*/}
                <div className="flex-grow mt-2 px-8 overflow-y-auto">
                    {todo.length !== 0 ? (
                        renderTodo()
                    ) : (
                        <div className="h-full flex justify-center items-center">
                            Nothing to do...
                        </div>
                    )}

                </div>



                {/*調整待辦/完成事項排序按鈕*/}
                <div className="border-t-2 border-border text-right my-2 mx-8 p-2 pb-0  flex justify-end items-center">
                    <p className=" font-medium">Move done things to end?</p>
                    <button className={`w-[40px] h-5 p-1 ml-1 rounded-xl flex items-center ${moveToEnd ? "justify-end bg-secondary" : "justify-start bg-white"}`} onClick={() => setMoveToEnd(prevState => !prevState)}>
                        <div className={`bg-secondary w-4 h-4 rounded-full ${moveToEnd ? "hidden" : "block"}`}></div>
                        <div className={`bg-white w-4 h-4 rounded-full ${moveToEnd ? "block" : "hidden"}`}></div>
                    </button>
                </div>

                {/*清除完成事項按鈕*/}
                <button className="mx-8 my-2 pr-2 flex justify-end" onClick={() => { setTodo([...todo.filter(item => !done.includes(item))]); setDone([]) }}>
                    <p>Clear Completed</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>

                {/*重置事項清單(todo/done/listName)*/}
                <button className="mx-8 my-2 pr-2 flex justify-end  text-[#DB8AEF]" onClick={() => handleResetTodolist()}>
                    <p>Reset Todolist</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>

                {/*Input*/}
                <form className="flex flex-col justify-start  mt-4 mb-4 mx-8" onSubmit={(e) => { handleAddTodo(e) }}>
                    <div className="text-left text-lg font-medium ">Add to list</div>
                    <div className="flex items-center ">
                        <input className="rounded-md h-10 w-full mr-1" value={matter} onChange={(e) => { setMatter(e.target.value) }} />
                        {/*新增待辦事項按鈕*/}
                        <button className="border bg-primary rounded-md w-14 flex justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="white" className="size-10 p-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                </form>


            </div>
        </div>
    )
}

export default Dashboard;