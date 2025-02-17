import { createContext } from 'react';
import usePosts from '../Hooks/usePosts';
 
const DataContext = createContext();
 
export const Data = ({ children }) => {

    const { posts } = usePosts();
 
    return (
        <DataContext.Provider value={{
 
        }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;