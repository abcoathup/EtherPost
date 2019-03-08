// import choo's template helper
var html = require('choo/html')

var uploadTemplate = require('./upload.js')

//takes an IPFS hash and displays the corresponding file
//has an upload form that allows uploading a file to IPFS

// export module
module.exports = function (state, emit) {
    return html `
    <div>
    <!-- Navbar -->
    <div class="w3-top">
     <div class="w3-bar w3-theme-d2 w3-left-align w3-large">
      <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" onclick="openNav()"><i class="fa fa-bars"></i></a>
      <a href="#" class="w3-bar-item w3-button w3-padding-large w3-theme-d4"><i class="fa fa-home w3-margin-right"></i>Logo</a>
      <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="News"><i class="fa fa-globe"></i></a>
      <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Account Settings"><i class="fa fa-user"></i></a>
      <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Messages"><i class="fa fa-envelope"></i></a>
      <div class="w3-dropdown-hover w3-hide-small">
        <button class="w3-button w3-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="w3-badge w3-right w3-small w3-green">3</span></button>     
        <div class="w3-dropdown-content w3-card-4 w3-bar-block" style="width:300px">
          <a href="#" class="w3-bar-item w3-button">One new friend request</a>
          <a href="#" class="w3-bar-item w3-button">John Doe posted on your wall</a>
          <a href="#" class="w3-bar-item w3-button">Jane likes your post</a>
        </div>
      </div>
      <a href="#" class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white" title="My Account">
        <img src="/w3images/avatar2.png" class="w3-circle" style="height:23px;width:23px" alt="Avatar">
      </a>
     </div>
    </div>
    
    <!-- Navbar on small screens -->
    <div id="navDemo" class="w3-bar-block w3-theme-d2 w3-hide w3-hide-large w3-hide-medium w3-large">
      <a href="#" class="w3-bar-item w3-button w3-padding-large">Link 1</a>
      <a href="#" class="w3-bar-item w3-button w3-padding-large">Link 2</a>
      <a href="#" class="w3-bar-item w3-button w3-padding-large">Link 3</a>
      <a href="#" class="w3-bar-item w3-button w3-padding-large">My Profile</a>
    </div>
    <script>
    // Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }
  </script>
  
        <div>

        

        <!-- Page Container -->
        <div class="w3-container w3-content" style="max-width:1400px;margin-top:80px">    
          <!-- The Grid -->
          <div class="w3-row">
            <!-- Left Column -->
            <div class="w3-col m3">

            <!-- Alert Box -->
            <div class="w3-container w3-display-container w3-round w3-theme-l4 w3-border w3-theme-border w3-margin-bottom w3-hide-small">
              <span onclick="this.parentElement.style.display='none'" class="w3-button w3-theme-l3 w3-display-topright">
                <i class="fa fa-remove"></i>
              </span>
              <p><strong>Hey!</strong></p>
              <p>Please upload more photos.</p>
            </div>


            <!-- Profile -->
              <div class="w3-card w3-round w3-white">
                <div class="w3-container">
                 <h4 class="w3-center">My Profile</h4>
                 <p class="w3-center"><img src="/w3images/avatar3.png" class="w3-circle" style="height:106px;width:106px" alt="Avatar"></p>
                 <hr>
                 <p><i class="fa fa-pencil fa-fw w3-margin-right w3-text-theme"></i> Designer, UI</p>
                </div>
                <div>${state.name}</div>
                <form onsubmit="${onSetName}" method="post">
                    <label for="name">Name:</label><br>
                    <input type="text" id="name" name="name">
                    <input type="submit" value="Set">
                </form>
                <div>${state.account}</div>
                <br />
              </div>
              <br>
              

            
            <!-- End Left Column -->
            </div>
            
            <!-- Middle Column -->
            <div class="w3-col m7">
            
            <div class="w3-row-padding">
            <div class="w3-col m12">
              <div class="w3-card w3-round w3-white">
                <div class="w3-container w3-padding">
                  <h6 class="w3-opacity">Social Media template by w3.css</h6>
                  <p contenteditable="true" class="w3-border w3-padding">Status: Feeling Blue</p>
                  <button type="button" class="w3-button w3-theme"><i class="fa fa-pencil"></i>  Post</button> 
                  <form onsubmit="${onUpload}" method="post">
                  <label for="picture">Upload:</label><br>
                  <input type="file" id="picture" name="picture" accept="image/gif, image/jpeg, image/png">
                  <input type="submit" value="Add">
                </form>            
    

                  </div>
              </div>
            </div>
          </div>
    
            
            
            
            ${state.uploads.map(upload)}

              
            <!-- End Middle Column -->
            </div>
            
            <!-- Right Column -->
            <div class="w3-col m2">
              <div class="w3-card w3-round w3-white w3-padding-16 w3-center">
                <p>Peepeth</p>
              </div>
              <br>

              <div class="w3-card w3-round w3-white w3-padding-16 w3-center">
                <p>RMIT</p>
              </div>
              <br>

              
            <!-- End Right Column -->
            </div>
            
          <!-- End Grid -->
          </div>
          
        <!-- End Page Container -->
        </div>
        <br>
        


        </div>
        <!-- Footer -->
        <footer class="w3-container w3-theme-d3 w3-padding-16">
          <h5>EtherPost</h5>
        </footer>
        
        <footer class="w3-container w3-theme-d5">
          <p>Powered by Caffinated Sugar Free Softdrink</p>
        </footer>
    </div>
    `

    

    function onUpload(e) {
        e.preventDefault()
        var picture = document.getElementById('picture').files[0];
        emit('upload', picture)
    }

    function onSetName(e) {
        e.preventDefault()
        var name = document.getElementById('name').value;
        emit('setName', name)
    }

    function onClap(e) {
        e.preventDefault()
        var ipfsHash = e.target.parentNode.parentNode.id;       
        emit('clap', ipfsHash)
    }

    function onComment(e) {
        e.preventDefault()
        var ipfsHash = e.target.name;
        var comment = e.target.comment.value;
        var data = { ipfsHash: ipfsHash, comment: comment };
        emit('comment', data)
    }

    function upload(upload, i) {
        return uploadTemplate(upload, onClap, onComment)
    }
}