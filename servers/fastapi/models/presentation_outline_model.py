from typing import List
from pydantic import BaseModel


class PresentationOutlineModel(BaseModel):
    slides: List[str]

    def to_string(self):
        message = ""
        for i, slide in enumerate(self.slides):
            message += f"## Slide {i+1}:\n"
            message += f"  - Content: {slide} \n"
        return message
