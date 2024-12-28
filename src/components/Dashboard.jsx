import React, { useEffect, useMemo, useRef, useState } from "react";
import Todo from "./Todo";
import { useAppContext } from "./AppProvider";
import PageTitle from "./PageTitle";

function Dashboard() {
    const [matter, setMatter] = useState("");  //保存Input的onChange內容
    const divUnderTodo = useRef(); //用於在待辦事件下生成空div以利後續scrollbar定位
    const { tasks, setTasks, moveToEnd, setMoveToEnd, page, setPage } = useAppContext();
    const [todo, setTodo] = useState(tasks[page].todo); //使用本地狀態保存部分全局狀態(hint: 某個Page的todo內容)
    const [done, setDone] = useState(tasks[page].done); //同上(hint: 某個Page的done內容)

    //監聽page變化進而調取tasks中不同page內的todo、done內容
    //思路: page是顯示對應事項清單得依據
    useEffect(() => {
        const currentTodo = tasks[page].todo;
        const currentDone = tasks[page].done;
        setTodo(currentTodo);
        setDone(currentDone);
    }, [page])

    //監聽todo變化用於定位scrollbar到新增的待辦事項、保存變化到tasks中
    useEffect(() => {
        if (divUnderTodo.current) {
            divUnderTodo.current.scrollIntoView({ behavior: "smooth" });
        }
        const newTasks = { ...tasks };
        newTasks[page].todo = todo;
        setTasks(newTasks);

    }, [todo]);

    //監聽done變化並將變化保存到tasks中
    useEffect(() => {
        const newTasks = { ...tasks };
        newTasks[page].done = done;
        setTasks(newTasks);

    }, [done]);

    //監聽todo/done變化以產生進度條數據
    const progress = useMemo(() => {
        console.log("todo:", todo);
        console.log("done:", done);
        return todo.length === 0 ? 0 : Math.round((done.length / todo.length) * 100);
    }, [todo, done])



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

    //重置事項清單(包含清單名稱)
    const handleResetTodolist = () => {
        setTodo([]);
        setDone([]);
        const newTasks = { ...tasks };
        newTasks[page].name = "";
        setTasks(newTasks);
    }


    //處理待辦事項渲染邏輯，分為是否啟動"Move done things to end"兩種狀況
    const renderTodo = () => {
        if (moveToEnd) {
            //顯示待辦事項，已完成的事項移至底部 
            //思路: 藉由done來篩選原來的todo，形成不含有完成事項的todo (hint: 原來todo有包含待辦與完成事項)
            return (
                <>
                    {todo.filter((item) => !done.includes(item)).map((item) => (
                        <Todo key={item} content={item} todo={todo} done={done} setTodo={setTodo} setDone={setDone} />
                    ))}
                    <div ref={divUnderTodo} className="h-[1px]" />
                    {done.map((item) => (
                        <Todo key={item} content={item} todo={todo} done={done} setTodo={setTodo} setDone={setDone} />
                    ))}
                </>
            );
        }
        else {
            return (
                <>
                    {todo.map((item) => <Todo key={item} content={item} todo={todo} done={done} setTodo={setTodo} setDone={setDone} />)}
                    <div ref={divUnderTodo} />
                </>
            )
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="w-[500px] h-[700px] flex flex-col text-tertiary bg-gradient-to-b from-[#eef7fe] to-[#ecedff]">

                {/*Logo與事項清單名稱*/}
                <div className="text-left mx-8  mt-10 border-b-2 border-border">
                    <h1 className=" text-3xl">Todo List</h1>
                    <p className="mb-4 text-sm">Add things to do</p>
                    {/*事項清單名稱*/}
                    <PageTitle pageNo="page1" onClick={() => setPage("page1")} />
                    <PageTitle pageNo="page2" onClick={() => setPage("page2")} />
                    <PageTitle pageNo="page3" onClick={() => setPage("page3")} />
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