from http.client import responses
from fastapi import FastAPI, File, UploadFile
from src.utils import MessageModel, VideoModel
from src.utils_1 import VideoModel as vm
from os import listdir
from os.path import isfile, join
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

origins = ["*"]
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return "api running!"


@app.post("/text/")
async def text(message:str):
    message_model=MessageModel()
    pred=message_model.predict(message=message)
    
    return pred


@app.post("/predict_vido")
async def predict_vido(video_file: UploadFile = File(...)):
    video_model=VideoModel()
    prediction=video_model.predict_using_video(video_file)
    print(prediction)
    return prediction

@app.post("/predict_vido_path")
async def predict_vido_path():
    video_model=vm()
    mypath="data/"
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
    path=onlyfiles[0]
    print(path)
    

    prediction=video_model.predict_using_video(path)
    responses={"video": prediction}
    # except: 
    #     responses[path]="Video Format is not support"
    print(responses)
    return responses


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)