import React, { FunctionComponent } from 'react';
import Category from '../../../models/Category';
import variables from '../../../assets/styles/variables.module.scss';

type Props = {
  category: Category;
  monochrome?: boolean;
}
type IconInfo = {
  c: Category;
  d: string;
}

const colorMap = {
  [Category.PUBLIC_OPINION]: variables.accent1,
  [Category.MEDIA]: variables.accent2,
  [Category.AUTHORITIES]: variables.accent3,
  [Category.COMMON]: variables.primary,
};

const categories: IconInfo[] = [
  { c: Category.MEDIA,          d: 'M10.2 12a6 6 0 100-12 6 6 0 000 12z' },   // top
  { c: Category.AUTHORITIES,    d: 'M14.4 19.3a6 6 0 100-12 6 6 0 000 12z' }, // bottom-right
  { c: Category.PUBLIC_OPINION, d: 'M6 19.3a6 6 0 100-12 6 6 0 000 12z' },    // bottom-left
];

export const CategoryIcon: FunctionComponent<Props> = ({ category, monochrome }: Props) => {
  const getOpacity = (expected: Category): number | undefined => (expected === category ? undefined : 0.2);
  const getFill = (expected: Category): string => (monochrome || expected !== category ? variables.primary : colorMap[category]);
  const getClassname = (expected: Category): string | undefined => (expected === category ? 'current' : undefined);

  // make sure the correct circle always comes above the others
  const sorted = [...categories];
  sorted.push(sorted.splice(sorted.findIndex((v) => v.c === category), 1)[0]);

  const paths = sorted.map((x) => (<path d={x.d} fill={getFill(x.c)} opacity={getOpacity(x.c)} className={getClassname(x.c)} key={`icon-${x.c}`} />));

  return (
    <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)" fill="#000">
        { paths }
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0h20.4v19.3H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

CategoryIcon.defaultProps = {
  monochrome: false,
};

export default CategoryIcon;
