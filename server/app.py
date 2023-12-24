from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

VMWARE_PATH = os.getenv('VMWARE_PATH')
vm_run = "vmrun"
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/test")
async def test():
    return "ok"

@app.post("/launch")
async def create_item(request: Request):
    try:
        data = await request.json()
        name = data.get("name")
        if name is None:
            raise HTTPException(status_code=422, detail="Name is required")
        
        print(VMWARE_PATH)
        
        return {"name": name}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

# Run the FastAPI application on port 8080
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8080)
