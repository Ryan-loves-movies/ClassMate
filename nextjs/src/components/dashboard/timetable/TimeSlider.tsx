'use client';
import React, {
    ChangeEvent,
    FC,
    useCallback,
    useEffect,
    useState,
    useRef
} from 'react';
import styles from '@components/dashboard/timetable/timeSlider.module.css';
import axios from 'axios';
import config from '@/config';
import { toast } from 'react-hot-toast';
const { expressHost } = config;

interface MultiRangeSliderProps {
    min: number;
    max: number;
    initMin: number;
    initMax: number;
    onChange: Function;
    step: number;
}

const updateRange = async (
    token: string,
    username: string,
    ay: number,
    sem: number,
    min: string,
    max: string
) => {
    return await axios
        .put(
            `${expressHost}/authorized/constraints`,
            {
                username: username,
                ay: ay,
                semester: sem,
                startTime: min,
                endTime: max
            },
            {
                headers: {
                    Authorization: token
                }
            }
        )
        .catch((err) =>
            toast.error(
                `Error occurred when updating time range constraint! ${err}`
            )
        );
};

const formatTimeValue = (time: number) => {
    const hours = String(Math.floor(time / 60) + 8).padStart(2, '0');
    const minutes = String(time % 60).padStart(2, '0');
    return `${hours}${minutes}`;
};

const TimeSlider: FC<MultiRangeSliderProps> = ({
    min,
    max,
    initMin,
    initMax,
    onChange,
    step
}) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    useEffect(() => {
        setMinVal(initMin);
        setMaxVal(initMax);
    }, [initMin, initMax]);

    return (
        <div className={styles['container']}>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                step={step}
                ref={minValRef}
                onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                    const value = Math.min(+event.target.value, maxVal - 1);
                    await updateRange(
                        sessionStorage.getItem('token') as string,
                        sessionStorage.getItem('username') as string,
                        parseInt(sessionStorage.getItem('ay') as string),
                        parseInt(sessionStorage.getItem('sem') as string),
                        formatTimeValue(value),
                        formatTimeValue(maxVal)
                    );
                    setMinVal(value);
                    event.target.value = value.toString();
                }}
                className={
                    minVal > max - 100
                        ? `${styles['thumb']} ${styles['thumb--zindex-5']}`
                        : `${styles['thumb']} ${styles['thumb--zindex-3']}`
                }
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                step={step}
                ref={maxValRef}
                onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                    const value = Math.max(+event.target.value, minVal + 1);
                    await updateRange(
                        sessionStorage.getItem('token') as string,
                        sessionStorage.getItem('username') as string,
                        parseInt(sessionStorage.getItem('ay') as string),
                        parseInt(sessionStorage.getItem('sem') as string),
                        formatTimeValue(minVal),
                        formatTimeValue(value)
                    );
                    setMaxVal(value);
                    event.target.value = value.toString();
                }}
                className={`${styles['thumb']} ${styles['thumb--zindex-4']}`}
            />

            <div className={styles['slider']}>
                <div className={styles['slider__track']}></div>
                <div ref={range} className={styles['slider__range']}></div>
                <div className={styles['slider__left-value']}>
                    {formatTimeValue(minVal)}
                </div>
                <div className={styles['slider__right-value']}>
                    {formatTimeValue(maxVal)}
                </div>
            </div>
        </div>
    );
};

export default TimeSlider;
