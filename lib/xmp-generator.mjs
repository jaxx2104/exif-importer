export function generateXMPContent(fileExtension, metadata) {
  const { createDate, modifyDate, gpsLongitude, gpsLatitude, cameraModel } =
    metadata;

  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="XMP Core 5.5.0">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:exif="http://ns.adobe.com/exif/1.0/"
    xmlns:tiff="http://ns.adobe.com/tiff/1.0/">
   <photoshop:SidecarForExtension>${fileExtension}</photoshop:SidecarForExtension>
   <photoshop:DateCreated>${createDate}</photoshop:DateCreated>
   <xmp:CreateDate>${createDate}</xmp:CreateDate>
   <xmp:ModifyDate>${modifyDate}</xmp:ModifyDate>
   <exif:GPSLongitude>${gpsLongitude}</exif:GPSLongitude>
   <exif:GPSLatitude>${gpsLatitude}</exif:GPSLatitude>
   <tiff:Model>${cameraModel}</tiff:Model>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}
