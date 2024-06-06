
const UserImage = ({ image, size = 60 }) => {
  return (

    <img
      src={`http://localhost:3001/assets/${image}`}
      width={size}

      className="border border-primary p-[2px] rounded-full"
      style={{ height: size }}
    />



  );
};

export default UserImage;