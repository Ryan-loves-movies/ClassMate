![image](https://github.com/Ryan-loves-movies/ClassMate/assets/61112961/a7f0859f-da6e-4ada-9859-74f12e69e386)

# ClassMate

### Prerequisites
- npm

### Project Structure
- Currently, this project is split between 2 folders that are to be build separately in the respective folders through `npm run build`
  - The nextjs project folder is the web application hosting the frontend (main entry file is `(login)/page.js`)
  - The server project folder hosts the express server required for api integration with the database backend hosted on AWS RDS
- After building, both projects can be deployed through `npm start`
- Note: The web app is hosted on port 3000 (as per norm for nextjs web app) and the express server is hosted on port 8080

### To-do list for future
- Separate the components of the dashboard into layout.tsx (To be shared across pages - sidebar, profile, searchbar) and page.tsx
  - In progress (Almost Done?)
- Store state of dark mode for persistence.
- Implement interactive sidebar for dashboard that expands when mouse hovers over it
  - Make sure this renders properly on mobile as well
- Implement pop-up when profile picture is clicked on to show settings page, log out component, ...
  - Somewhat done??
- Implement interface for timetable
  - Implement actual timetable optimiser
- Implement search function?
