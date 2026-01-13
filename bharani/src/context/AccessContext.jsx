import React, { createContext, useContext, useState } from 'react';

const AccessContext = createContext();

export const useAccess = () => useContext(AccessContext);

export const ACCESS_LEVELS = {
    FREE: 'FREE',
    PRO: 'PRO'
};

export const AccessProvider = ({ children }) => {
    const [tier, setTier] = useState(ACCESS_LEVELS.FREE);

    const upgradeToPro = () => setTier(ACCESS_LEVELS.PRO);
    const downgradeToFree = () => setTier(ACCESS_LEVELS.FREE);

    return (
        <AccessContext.Provider value={{ tier, upgradeToPro, downgradeToFree }}>
            {children}
        </AccessContext.Provider>
    );
};
