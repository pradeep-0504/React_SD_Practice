import { useEffect,useState,useRef } from 'react';
import './App.css'

function App() {
  const[input,setInput]=useState("");
  const[results,setResults]=useState([]);
  const[showResults,setShowResults]=useState(false);
  const[selectedRecipe,setSelectedRecipe]=useState(null);

  const cache=useRef({})

    const fetchData=async()=>{

      if(!input.trim()){
        setResults([]);
        return;
      }

    if(cache.current[input]){
      console.log("cache returned ",input);
      setResults(cache.current[input]);
      return;
    }

    const data=await fetch("https://dummyjson.com/recipes/search?q="+ input);
    console.log('function called '+ input);
    const json=await data.json();
    setResults(json?.recipes);
    // setCache((prev)=>({...prev,[input]:json?.recipes}))
    cache.current[input]=json?.recipes;
    }
    useEffect(()=>{
      const Timer=setTimeout(fetchData,300);
      return(()=>{
        clearTimeout(Timer);
      })
    },[input]);

    const handleRecipeClick=(recipe)=>{
      setInput(recipe.name);
      setSelectedRecipe(recipe);
      setShowResults(false);
    }



  return (
    <div className='app'>
    <h1>Auto complete search Bar</h1>
    <input type="text"
    value={input}
           className="search-input"
           onChange={(e)=>{setInput(e.target.value);
            setSelectedRecipe(null);
           } }
           onFocus={()=>setShowResults(true)}
           onBlur={()=>setShowResults(false)}
    />
    {showResults && (<div className='result-container'>
     { results.map((r)=>(
        <span className="result" key={r.id} onMouseDown={()=>handleRecipeClick(r)}>{r.name}</span>
      ))}
    </div>)}

    {/* Recipe Details */}

    
    {selectedRecipe && (
  <div>
    <h2>{selectedRecipe.name}</h2>

    <h3>Ingredients</h3>
    <ul>
      {selectedRecipe.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
    </ul>

    <h3>Instructions</h3>
    <ol>
      {selectedRecipe.instructions.map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ol>
  </div>
)}
    </div>
  )
}

export default App
