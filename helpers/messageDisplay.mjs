function messageDisplay(heading,message,response){
    let messageDescription = {
      heading: heading,
      message: message,
      menu: [
        {
          description: "Continue",
          route: "/index.html"
        }
      ]
    };
    response.render('menupage.ejs', messageDescription);
  }

  export { messageDisplay as messageDisplay };
