import Link, { LinkProps } from '@mui/material/Link';

const mdxComponents = {
  a(props: LinkProps) {
    return <Link {...props} />;
  },
};

export default mdxComponents;
