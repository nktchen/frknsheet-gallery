import ContentLoader from "react-content-loader";

const Skeleton = (props) => (
  <ContentLoader
    speed={2}
    width={300}
    height={515}
    viewBox="0 0 300 515"
    backgroundColor="#222222"
    foregroundColor="#1a1a1a"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="300" height="423" />
    <rect x="0" y="443" rx="3" ry="3" width="300" height="24" />
    <rect x="0" y="487" rx="3" ry="3" width="300" height="28" />
  </ContentLoader>
);

export default Skeleton;
