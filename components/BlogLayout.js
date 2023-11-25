import BlogBreadcrumbs from "./BlogBreadcrumbs";

// imported into every page in "blog" pages directory
const BlogLayout = ({ children }) => {
  return (
    <div>
      <div className=" w-5/6 mx-auto">
        <BlogBreadcrumbs />
      </div>

      {children}
    </div>
  );
};

export default BlogLayout;
