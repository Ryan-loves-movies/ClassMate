type loginProps = {
    type: string;
    placeholder: string;
    name: string;
    leftIcon: string;
    rightIcon: string;
};
export default function LoginField({ type, placeholder, name, leftIcon, rightIcon="" }: loginProps) {
    if (rightIcon === "") {
        return (
            <div className="flex flex-wrap items-stretch w-full relative h-15 bg-white items-center rounded mb-4">
                <div className="flex -mr-px justify-center w-15 p-4">
                    <span
                        className="flex items-center leading-normal bg-white rounded rounded-r-none text-xl px-3 whitespace-no-wrap text-gray-600"
                    >
                        <i className={leftIcon} />
                    </span
                    >
                </div>
                <input
                    type={type}
                    name={name}
                    className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                    placeholder={placeholder}
                />
            </div>
        )
    }
    return (
        <div className="flex flex-wrap items-stretch w-full relative h-15 bg-white items-center rounded mb-4">
            <div className="flex -mr-px justify-center w-15 p-4">
                <span
                    className="flex items-center leading-normal bg-white rounded rounded-r-none text-xl px-3 whitespace-no-wrap text-gray-600"
                >
                    <i className={leftIcon} />
                </span
                >
            </div>
            <input
                type={type}
                name={name}
                className="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border-0 h-10 px-3 relative self-center font-roboto text-xl outline-none"
                placeholder={placeholder}
            />
            <div className="flex -mr-px">
                <span
                    className="flex items-center leading-normal bg-white rounded rounded-l-none border-0 px-3 whitespace-no-wrap text-gray-600"
                >
                    <i className={rightIcon}></i>
                </span>
            </div>
        </div>
    )
}
