import { useState, useEffect } from 'react';

export default function useCountdown(callback) {
    const [centiseconds, setCentiseconds] = useState(0);

    useEffect(() => {
        if (centiseconds <= 0) {
            callback.call();
            return;
        }

        const interval = setInterval(() => {
            setCentiseconds(centiseconds - 1);
        }, 10); // Update every 10 milliseconds (1 centisecond)

        return () => clearInterval(interval);
    }, [callback, centiseconds]);

    function start(numCentiseconds) {
        setCentiseconds(numCentiseconds);
    }

    return { centiseconds, start };
}
