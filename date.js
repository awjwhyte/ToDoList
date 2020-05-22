exports.getDate = () => {
    const x = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return x.toLocaleDateString('en-us', options);
};
