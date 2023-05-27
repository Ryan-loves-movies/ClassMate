import { ReactElement } from "react";

type loginProps = {
    children?: ReactElement | ReactElement[];
    leftIcon: string;
    rightIcon: string;
};

function LeftField({ icon }: { icon: string }) {
    return (
        <div className="flex -mr-px justify-center w-15 p-4">
            <span
                className="flex items-center leading-normal bg-white rounded rounded-r-none text-xl px-3 whitespace-no-wrap text-gray-600"
            >
                <i className={icon} />
            </span>
        </div>
    )
}

function RightField({ icon }: { icon: string }) {
    return (
        <div className="flex -mr-px">
            <span
                className="flex items-center leading-normal bg-white rounded rounded-l-none border-0 px-3 whitespace-no-wrap text-gray-600"
            >
                <i className={icon}></i>
            </span>
        </div>
    )
}
export default function LoginField({ children, leftIcon, rightIcon = "" }: loginProps) {

    return (
        <div className="flex flex-wrap items-stretch w-full relative h-15 bg-white items-center rounded mb-4">
            <LeftField icon={leftIcon} />
            {children}
            {!!rightIcon && <RightField icon={rightIcon} />}
        </div>
    )
}
