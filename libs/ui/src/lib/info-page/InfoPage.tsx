interface InfoPageProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
}

/**
 * Used for terms and conditions + privacy policy.
 */
const InfoPage: React.FC<InfoPageProps> = ({ children, title }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white-ish break-words filter drop-shadow-card mx-auto overflow-hidden px-4 rounded-2xl whitespace-pre-wrap sm:px-6 lg:px-8">
        <article className="prose-sm md:prose max-w-none md:max-w-none">
          <h1 className="bg-purple-subtle-fill border-b boder-purple-subtle-stroke py-4 text-center -mx-4 sm:-mx-6 sm:py-6 lg:-mx-8">
            {title}
          </h1>
          {children}
        </article>
      </div>
    </div>
  );
};

export default InfoPage;
