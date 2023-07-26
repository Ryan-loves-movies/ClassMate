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

interface MultiRangeSliderProps {
    min: number;
    max: number;
    onChange: Function;
    step: number;
}

const roundToNearest30 = (time: number) => {
    return Math.round(time / 30) * 30;
};

const formatTimeValue = (time: number) => {
    const hours = String(Math.floor(time / 60) + 8).padStart(2, '0');
    const minutes = String(time % 60).padStart(2, '0');
    return `${hours}${minutes}`;
};

const TimeSlider: FC<MultiRangeSliderProps> = ({
    min,
    max,
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

    return (
        <div className={styles['container']}>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                step={step}
                ref={minValRef}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = Math.min(+event.target.value, maxVal - 1);
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
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = Math.max(+event.target.value, minVal + 1);
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
