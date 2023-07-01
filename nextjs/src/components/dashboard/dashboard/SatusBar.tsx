import styles from '@components/dashboard/dashboard/statusBar.module.css'

export default function StatusBar({ color, width, descriptor }: {
    color: string,
    width: string,
    descriptor: string
}) {
    const heightRatio = 0.4;

    // Extract the numerical value from the width string
    const parsedWidth = parseFloat(width);
    const widthUnit = width.match(/\D+$/); // Extract the unit from the width string

    // Calculate the height based on the parsed width and the ratio
    const height = parsedWidth * heightRatio;

    // Create a string with the height and unit
    const heightWithUnit = `${height}${widthUnit}`;

    return (
        <div className={styles['wrapper']}>
            <div className={styles['background']} style={{ backgroundColor: color, width: width, height: heightWithUnit }} />
            <div className={styles['description']} style={{ width: width, height: heightWithUnit }}>
                {descriptor}
            </div>
        </div>
    )
}
