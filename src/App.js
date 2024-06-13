import React, { useState,useEffect } from 'react';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useSnackbar } from 'notistack';
import './App.css'; 



const getImage = async (itemName) => {
  const res = await fetch(`https://api.unsplash.com/search/photos?page=1&per_page=1&query=${itemName}&client_id=QVNnSg4vx7KijqZvPhuEIXPDM256eCnRbjBz95OOwYA`);
  const data = await res.json();
  console.log(data);
  if (data.results.length > 0) {
    return data.results[0].urls.regular;
  }
  return "https://t3.ftcdn.net/jpg/05/03/23/16/360_F_503231682_h16oJUxdOwCvCA8WDd8FbfKvLaT1pZgb.jpg";
}



function App() {

  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itemName.trim() === "") {
      setError("Item name cannot be empty");
      return;
    }

    if (items.some(item => item.item.toLowerCase() === itemName.toLowerCase())) {
      enqueueSnackbar('Item already exists in list', {
        variant: 'warning'
        ,autoHideDuration: 2000,
        ContentProps: { className: 'custom-snackbar' }
        });
      return;
    }

    try {
      const taskbgimg = await getImage(itemName);
      console.log(taskbgimg);
      setItems([...items, { item: itemName, completed: false, bgimg: taskbgimg }]);
      setItemName("");
      setError("");
    } catch (error) {
      console.error("Error fetching image:", error);
      setError("Failed to fetch image");
    }
  };

  const removeItem = (index) => {
    const filteredItems = items.filter((_, i) => i !== index);
    setItems(filteredItems);
  };

  const removeThatItem =(index)=>{
    removeItem(index);
    enqueueSnackbar('Item removed from list!', { 
      variant: 'error',
      autoHideDuration: 2000,
      ContentProps: { className: 'custom-snackbar' }
     });

  }

  const markAsDone = (index) => {

    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );

    if (updatedItems[index].completed) {
      const completedItem = updatedItems.splice(index, 1)[0];
      updatedItems.push(completedItem);
    }

    setItems(updatedItems);
  };


  const handleButtonClick=(index)=>{
    markAsDone(index);
    enqueueSnackbar('Task completed!', {
       variant: 'success'
       ,autoHideDuration: 2000,
       ContentProps: { className: 'custom-snackbar' }
       });
  }

  // useEffect(() => {
  //   const storedItems = localStorage.getItem('items');
  //   if (storedItems) {
  //     setItems(JSON.parse(storedItems));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('items', JSON.stringify(items));
  // }, [items]);

  return (
    <div className="w-full pt-[10px] flex flex-col items-center min-h-[100vh] bg-gray-200 font-ubantu px-[20px] lg:px-[0]">
      <h1 className='text-4xl text-pink-700 mt-[10px] font-rice'>Shopping-list</h1>
      <div className="w-full h-[40px] mt-[20px] flex justify-center">
        <form onSubmit={handleSubmit} className="h-full flex items-center mt-[7px]">
          <input
            className="h-[40px] text-lg w-[200px] border rounded-md pl-[10px] border-gray-500 outline-none"
            type="text"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
              if (error) setError("");
            }}
          />
          <button
            type="submit"
            className="w-[100px] h-[40px] bg-gray-500 text-white ml-2 text-[15px] font-semibold rounded md hover:bg-gray-600"
          >
            Add Item
          </button>
        </form>
      </div>

      {error && <div className="text-red-500 mt-1 text-base font-semibold">{error}</div>}

      <div className="w-[84.1%] h-[auto] flex gap-[25px] justify-start transparent mt-[40px] flex-wrap mb-[100px]">
        {items.map((item, index) => (
          <div
            key={index}
            className="h-[150px] w-[100%] lg:w-[300px]  p-[10px] flex flex-col relative rounded-lg overflow-hidden"
            style={{ backgroundImage: `url(${item.bgimg})`, backgroundSize: 'cover',backgroundPosition:'center' }}
          >
            
            <div className={item.completed ? "absolute inset-0 bg-black opacity-80" : "absolute inset-0 bg-black opacity-40"}></div>

            <div className="flex w-full h-[50px] justify-between items-center">
              <h1 className={item.completed ? "line-through text-white text-[30px] font-semibold z-10" : "text-white text-[30px] font-semibold z-10"}>{item.item}</h1>
              <button 
                className='z-10 w-[30px] h-[30px] bg-red-600 rounded'
                 onClick={() => removeThatItem(index)}>
                <DeleteRoundedIcon className="hover:cursor-pointer text-white z-10"></DeleteRoundedIcon>
              </button>
            </div>
            <button
              onClick={() => handleButtonClick(index)}
              className="mt-[auto] ml-[auto] w-[30px] h-[30px] bg-green-500 rounded z-10"
              style={{ color: "white" }} 
            >
              <DoneAllIcon/>
            </button>
          </div>

        ))}
      </div>
    </div>
  );
}

export default App;
