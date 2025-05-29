interface Props {
    title: string;
    subtitle?: string;
}

export const Header = ({ title, subtitle }: Props) => (
    <div className="text-center mb-12">
        {/* <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"> */}
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
        </h1>

        {subtitle && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
                {subtitle}
            </p>
        )}
    </div>
);