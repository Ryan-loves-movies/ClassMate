const styles = new Proxy(
    {},
    {
        get: (target, prop) => prop // Return the property name as the value
    }
);

export default styles;
