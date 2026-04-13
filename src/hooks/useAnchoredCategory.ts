import { useContext } from 'react';
import { AnchorCategoryContext, ArchorCategoryContextProps } from '../context/AnchorCategoryContext';

function useAnchoredCategory(): ArchorCategoryContextProps {
  return useContext(AnchorCategoryContext);
}

export default useAnchoredCategory;
