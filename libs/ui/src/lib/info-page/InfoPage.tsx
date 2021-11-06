interface InfoPageProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    title: string;
}

/**
 * Used for terms and conditions + privacy policy.
 */
const InfoPage: React.FC<InfoPageProps> = ({ title, children, ...rest }) => {
    return (
        <div className="w-10/12 text-lg font-bold text-black rounded-t-2xl filter drop-shadow-card mx-auto">
            <div className="block text-center rounded-t-2xl bg-purple-subtle-fill w-full border-b boder-purple-subtle-stroke text-xl p-6">{title}</div>
            <div className="flex flex-col gap-4 w-full bg-white-ish px-4 text-sm py-6">{children}</div>
        </div>
    )
}

export default InfoPage;