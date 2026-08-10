import ProjectPage from '../ProjectPage';

export default function RCTankPage() {
    return (
        <ProjectPage
            project = {{
                name: "RC Tank",
                title: "3D-Printed Arduino Remote-Controlled Tank",
                description:
                    <p>
                        This was my final project for my grade 12 computer engineering class, in collaboration with two
                        other classmates.<br/><br/>
                        During this project, we looked into many different applications of Arduino boards and we
                        eventually settled on making a remote-controlled vehicle.<br/><br/>
                        We knew that this project was very ambitious, but with three very dedicated students, we
                        persevered.<br/><br/>
                        We admittedly had a lot of difficulty at first when trying to make the Bluetooth module to work as
                        intended, but we eventually successfully achieved proper functionality and the bytes were being received as
                        required.<br/><br/>
                        Using reserved ranges of bytes, we were able to smoothly control the tank's speed with a slider
                        in our very own custom-made Android app. Following this breakthrough, later on, we also added
                        the ability to turn the tank itself, as well as its muzzle.<br/><br/>
                        We then 3D-printed our own custom-made chassis and installed the necessary components.<br/><br/>
                        Eventually, we also engineered a motor-controlled valve to shoot harmless
                        projectiles using carbon dioxide as a propellant.<br/><br/>
                        Finally, we added a range sensor at the end of the muzzle and implemented algorithms that, at the press of a button on the app, enables the tank to enter a mode that automatically scans for nearby objects.
                    </p>
            }}
            overview = {{
                boxes: [
                    {
                        title: "Bluetooth",
                        icon: "bluetooth",
                        description: "Utilizes Bluetooth for remote control."
                    },
                    {
                        title: "Android App",
                        icon: "android",
                        description: "A custom-made Android app that turns any phone into a remote to control the tank."
                    },
                    {
                        title: "Sensors",
                        icon: "camera",
                        description: "Automatically scans for nearby objects and determines their distance."
                    }
                ]
            }}
            languages = {[
                {
                    name: "Arduino",
                    icon: "Arduino.svg",
                    iconPadding: 5
                },
                {
                    name: "MIT App Inventor",
                    icon: "App Inventor.png"
                }
            ]}
            gallery = {[
                {
                    title: "Assembled Tank",
                    path: "RC Tank/Assembled.jpg",
                    description: "The assembled version of our project."
                },
                {
                    title: "Arduino Board",
                    path: "RC Tank/Arduino Board.jpg",
                    description: "The Arduino board with the PWM hat installed and the Bluetooth module connected."
                },
                {
                    title: "Android App",
                    path: "RC Tank/App.jpg",
                    description: "The visuals of the Android app made with MIT App Inventor."
                },
                {
                    title: "3D-Printed Chassis",
                    path: "RC Tank/Chassis.jpg",
                    description: "The 3D-printed chassis assembly of our tank."
                },
                {
                    title: "Connecting Components",
                    path: "RC Tank/Connecting Components.jpg",
                    description: "The components being connected inside the chassis."
                },
                {
                    title: "App Code",
                    path: "RC Tank/App Code Snippet.jpg",
                    description: "A snippet of our Android app's code."
                },
                {
                    title: "Bytes Sending",
                    path: "RC Tank/Bytes Sending.jpg",
                    description: "An example of the bytes sent from the Android app to the Bluetooth module and then processed by the Arduino board."
                },
            ]}
            videos = {[
                {
                    title: "Muzzle Scanning",
                    src: "Projects/RC Tank/Tank.mp4"
                }
            ]}
        />
    );
}