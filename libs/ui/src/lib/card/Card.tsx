import classNames from 'classnames';

export interface CardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  height?: number;
  isElevated?: boolean;
}

const Card: React.FC<CardProps> = ({
  className,
  children,
  height,
  isElevated,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        'inline-flex border-4 border-white bg-white w-80 max-w-full filter p-4 rounded-3xl select-none',
        isElevated ? 'drop-shadow-lg' : '',
        className
      )}
      style={{ boxShadow: 'inset 0 0 24px rgba(0,0,0,0.4)', height }}
      {...rest}
    >
      <div className="w-full">{children}</div>
    </div>
  );
};

Card.defaultProps = {
  height: 448, // 2.5 x 3.5 ratio
};

export default Card;
