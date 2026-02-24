"use client"
import { useEffect, useState } from 'react';

export default function ApiDebug() {
    const [envValue, setEnvValue] = useState<string | undefined>("Loading...");

    useEffect(() => {
        setEnvValue(process.env.NEXT_PUBLIC_API_URL);
    }, []);

    return (
        <div style={{ padding: '50px', fontFamily: 'monospace' }}>
            <h1>🔍 Deployment Debugger</h1>
            <hr />
            <p><strong>URL in Browser:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            <p><strong>NEXT_PUBLIC_API_URL Value:</strong> 
                <span style={{ color: envValue ? 'green' : 'red', fontWeight: 'bold', marginLeft: '10px' }}>
                    {envValue || "UNDEFINED (This is why it is failing)"}
                </span>
            </p>
            <p><strong>Current Fallback:</strong> http://localhost:3001/api/v1</p>
            <hr />
            <p>If the value above is <strong>UNDEFINED</strong>, then Vercel is not passing the variable to the build.</p>
            <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Refresh to check again
            </button>
        </div>
    );
}
