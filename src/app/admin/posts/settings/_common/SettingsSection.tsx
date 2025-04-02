const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-t border-gray-200 pt-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

export default SettingsSection