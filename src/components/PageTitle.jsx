import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "./AppProvider";

function PageTitle({ pageNo, onClick }) {
    const inputOfListName = useRef(); //用來操作清單名稱input
    const [readOnly, setReadOnly] = useState(true); //用於管理清單名稱可否被編輯
    const { tasks, setTasks, page } = useAppContext();


    //監聽readOnly變化(true: 失焦；false: 清單名稱可以修改，需要focus、select該Input內容)
    useEffect(() => {
        if (!readOnly && inputOfListName.current) {
            inputOfListName.current.focus();
            inputOfListName.current.select();
        }
        else if (readOnly && inputOfListName.current) {
            inputOfListName.current.blur();
        }
    }, [readOnly])

    //處理重新命名事項清單(hint: 轉換可編輯性、處理變更、處理Enter按鍵)
    const switchReadOnlyValue = () => {
        setReadOnly(prevState => !prevState);
    }
    const handleListNameChnage = (value) => {
        const newTasks = { ...tasks };
        newTasks[pageNo].name = value;
        setTasks(newTasks);
    }
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            switchReadOnlyValue();
        }
    }

    return (
        <div className={`group inline-block ml-1 relative top-[2px]  ${pageNo === page ? "bg-[#eef7fe]" : "bg-white"}`} onClick={onClick}>
            <input
                ref={inputOfListName}
                type="text"
                value={tasks[pageNo].name}
                onChange={(e) => handleListNameChnage(e.target.value)}
                onKeyDown={e => handleKeyDown(e)}
                className={`w-[100px] border-2 border-border  ml-0 -mb-0 p-1 pb-0 rounded-t-md hover:cursor-pointer bg-transparent
                    ${pageNo === page ? "border-b-[#eef7fe]" : ""}`}
                readOnly={readOnly}
                placeholder={`Untitle List-${pageNo[4]}`} />
            
            {pageNo === page && (
                <>
                    {/*編輯名稱按鈕*/}
                    <div className={`absolute z-50 top-1 -right-6 cursor-pointer w-5 h-5 bg-primary rounded-full flex items-center justify-center
                transition-all duration-500 opacity-0 group-hover:opacity-100`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="white"
                            className="size-4"
                            onClick={() => switchReadOnlyValue()}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </div>
                    {/*完成名稱編輯按鈕*/}
                    <div className={`absolute z-[60] top-1 -right-6 cursor-pointer w-5 h-5 bg-primary rounded-full flex items-center justify-center
                transition-all duration-500 ${readOnly ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white"
                            className="size-4"
                            onClick={() =>  switchReadOnlyValue() }>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                </>
            )}

        </div>
    )
}

export default PageTitle;