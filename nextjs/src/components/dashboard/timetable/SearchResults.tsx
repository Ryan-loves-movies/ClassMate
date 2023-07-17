import module from '@models/module';
import styles from '@components/dashboard/timetable/searchResults.module.css';

export default function SearchResults({
    handleMouseEnter,
    handleMouseDown,
    focusedIndex,
    searchRes
}: {
    handleMouseEnter: (index: number) => void;
    handleMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
    focusedIndex: number;
    searchRes: module[];
}) {
    return (
        <ul className={styles['list']} id="mod-search-results">
            {searchRes.map((item, index: number) => (
                <li
                    key={item.code}
                    className={index === focusedIndex ? styles['selected'] : ''}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseDown={handleMouseDown}
                >
                    <span className={styles['module-code']}>{item.code}</span>
                    <span className={styles['module-title']}>{item.name}</span>
                </li>
            ))}
        </ul>
    );
}
