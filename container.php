<?php

// Load projects into object.
// This is an implementation point that is not included here. If you wish to use this code you'll
// need to create your own solution that will adhere to the code here.
$projects = unserialize( $_SESSION['projects'] );
$project = $projects->get_current();

// The project class the object above at least has 3 data variables.
// The title, index and html element that contains the layout and text for the project for display.

$navigation_element_name = 'project-navigation';
$left_navigation_element_name = 'project-left';
$right_navigation_element_name = 'project-right';
$navigation_title_element_name = 'project-nav-text';
$title_element_name = 'project-title';
$dot_selector_name = 'project-dot-selector';
$selector_current_name = 'current';
$content_element_name = 'project-content';
?>
<div class="project-container">
    <div class="<?php echo $navigation_element_name; ?>">
        <div class="<?php echo $left_navigation_element_name; ?> nav-item">
            <img class="project-navigation-icon" src="images/icons/left_arrow.svg"
                 alt="Project carousel left navigation arrow">
        </div>
        <h2 class="<?php echo $title_element_name; ?>"><?php echo $project['title']; ?></h2>
        <div class="<?php echo $right_navigation_element_name; ?> nav-item">
            <img  class="project-navigation-icon" src="images/icons/right_arrow.svg"
                  alt="Project carousel right navigation arrow">
        </div>
    </div>
    <div class="<?php echo $dot_selector_name; ?>">
        <ul><!--
            <?php for($i = 0; $i < $projects->count(); $i ++) : ?>
             --><li data-index="<?php echo $i; ?>"
                    <?php echo $projects->get_current_index() == $i ? 'class="'.$selector_current_name.'"' : ''; ?>>
                </li><!--
            <?php endfor; ?>
     --></ul>
    </div>
    <div class="project-content">
        <?php echo $project['element']; ?>
    </div>
</div>
<script src="js/system.js"></script>
<script src="js/named-register.js"></script>
<script src="js/project_nav.js"></script>
<script>
    // Setup the carousel app. Pass through the elements here to avoid loading them in the app script.
    System.import("main").then(module => {
        const variables = {
            ajaxUrl: document.baseURI + '/ajax.php',
            navigationElement: document.getElementsByClassName('<?php echo $navigation_element_name; ?>')[0],
            leftNavigationControl: document.getElementsByClassName('<?php echo $left_navigation_element_name; ?>')[0],
            rightNavigationControl: document.getElementsByClassName('<?php echo $right_navigation_element_name; ?>')[0],
            navigationControlTitleClassName: '<?php echo $navigation_title_element_name; ?>',
            titleElement: document.getElementsByClassName('<?php echo $title_element_name; ?>')[0],
            dotSelectorElement: document.getElementsByClassName('<?php echo $dot_selector_name; ?>')[0],
            selectorClassName: '<?php echo $selector_current_name; ?>',
            contentElement: document.getElementsByClassName('<?php echo $content_element_name; ?>')[0],
        };
        const app = new module.App(variables);
        app.start();
    });
</script>
