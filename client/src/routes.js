import React from 'react'

import {Routes, Route} from 'react-router';

export const useRoutes = appRoutes => {
            const ar = () => {
                return (
                    (appRoutes.map((elem) => {
                        return <Route key={elem.path} exact path={elem.path} element={elem.element} />
                    }))
                )
            }
            return(
                <Routes>
                    {ar()}
                </Routes>
            )
}