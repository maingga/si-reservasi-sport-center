type Props = {
  title: string;
  value: string | number;
};

export default function CardStats({ title, value }: Props) {
  return (
    <div
      className="
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        rounded-xl
        p-5
        shadow-sm dark:shadow-none
        hover:shadow-md dark:hover:shadow-lg
        transition-shadow duration-300
        cursor-default
      "
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-1 truncate max-w-full">
        {value}
      </p>
    </div>
  );
}
