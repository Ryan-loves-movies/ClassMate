import module from '@models/module';
import styles from '@components/dashboard/timetable/searchResults.module.css';

export default function SearchResults({
    handleMouseEnter,
    focusedIndex,
    searchRes
}: {
    handleMouseEnter: (index: number) => void;
    focusedIndex: number;
    searchRes: module[];
}) {
    return (
            <ul className={styles['list']}>
                {searchRes.map((item, index: number) => (
                    <li
                        key={item.code}
                        className={
                            index === focusedIndex ? styles['selected'] : ''
                        }
                        onMouseEnter={() => handleMouseEnter(index)}
                    >
                        <span className={styles['module-code']}>
                            {item.code}
                        </span>
                        <span className={styles['module-title']}>
                            {item.name}
                        </span>
                    </li>
                ))}
            </ul>
    );
}
