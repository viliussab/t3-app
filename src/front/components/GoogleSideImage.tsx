import React from "react";
import Image from "next/image";

type ComponentProps = {
    width: number,
    height: number,
    googleDriveUrl: string | null,
}

const GoogleSideImage = (props : ComponentProps) => {
  const { 
    width,
    height,
    googleDriveUrl
  } = props;

  const getImageIdWithNoise = (value: string) => {
    const driveOpenLink = /^https:\/\/drive.google.com\/open\?id=(.*)$/;
    const driveFileLink = /^https:\/\/drive.google.com\/file\/d\/(.*)$/;

    const matchOpen = value.match(driveOpenLink);
    const matchFile = value.match(driveFileLink);

    if (matchOpen) {
      return matchOpen[1];
    }

    if (matchFile) {
      return matchFile[1];
    }

    return null;
  };

  const getImageId = (value: string) => {
    const inpureId = getImageIdWithNoise(value);

    if (inpureId) {
      const indexToStop = inpureId.lastIndexOf("/view");

      if (indexToStop === -1) {
        return inpureId;
      }

      const id = inpureId.substring(0, indexToStop);

      return id;
    }
  };

  const toGoogleDriveToImageSource = (value: string) => {
    const url = `https://drive.google.com/uc?export=view&id=${getImageId(value)}`;
    return url;
  };

  return <>{googleDriveUrl && (
    <a href={googleDriveUrl}>
      <div style={{width: `${width}px`, height: `${height}px`}}>
        <Image 
          src={toGoogleDriveToImageSource(googleDriveUrl)}
          alt="Neveikianti plokštumos nuotrauka"
          width={width}
          height={height}
          style={{objectFit: "cover"}} />
      </div>
    </a>
  )}
  </>;
};

export default GoogleSideImage;
