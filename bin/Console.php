<?php

/**
 * Part of Simple Console project.
 *
 * @copyright  Copyright (C) 2017 Simon Asika.
 * @license    MIT
 */

namespace Asika\SimpleConsole;

class Console
{
    /**
     * @var  string
     */
    protected $executable;

    /**
     * @var  array
     */
    protected $args = array();

    /**
     * @var  array
     */
    protected $options = array();

    /**
     * @var  string
     */
    protected $help = '';

    /**
     * @var  array
     */
    protected $helpOptions = array('h', 'help');

    /**
     * @var  array
     */
    protected $booleanMapping = array(
        0 => array('n', 'no', 'false', 0, '0', true),
        1 => array('y', 'yes', 'true', 1, '1', false, null)
    );

    /**
     * @param array $argv
     */
    public function __construct($argv = null)
    {
        $this->parseArgv($argv ?: $_SERVER['argv']);

        $this->init();
    }

    /**
     * @return  void
     */
    protected function init()
    {
        // Override if necessary
    }

    /**
     * @param \Closure|null $callback
     *
     * @return  int
     */
    public function execute(\Closure $callback = null)
    {
        try {
            if ($this->getOption($this->helpOptions)) {
                $this->out($this->getHelp());

                return 0;
            }

            if ($callback) {
                if (PHP_VERSION_ID >= 50400) {
                    $callback = $callback->bindTo($this);
                }

                $result = call_user_func($callback, $this);
            } else {
                $result = $this->doExecute();
            }
        } catch (\Exception $e) {
            $result = $this->handleException($e);
        } catch (\Throwable $e) {
            $result = $this->handleException($e);
        }

        if ($result === true) {
            $result = 0;
        } elseif ($result === false) {
            $result = 255;
        } else {
            $result = (bool) $result;
        }

        return (int) $result;
    }

    /**
     * @return  mixed
     */
    protected function doExecute()
    {
        // Please override this method.
        return 0;
    }

    /**
     * @param string $method
     *
     * @return  mixed
     */
    protected function delegate($method)
    {
        $args = func_get_args();
        array_shift($args);

        if (!is_callable(array($this, $method))) {
            throw new \LogicException(sprintf('Method: %s not found', $method));
        }

        return call_user_func_array(array($this, $method), $args);
    }

    /**
     * @return  string
     */
    protected function getHelp()
    {
        return trim($this->help);
    }

    /**
     * @param \Exception|\Throwable $e
     *
     * @return  int
     */
    protected function handleException($e)
    {
        $v = $this->getOption('v');

        if ($e instanceof CommandArgsException) {
            $this->err('[Warning] ' . $e->getMessage())
                ->err()
                ->err($this->getHelp());
        } else {
            $this->err('[Error] ' . $e->getMessage());
        }

        if ($v) {
            $this->err('[Backtrace]:')
                ->err($e->getTraceAsString());
        }

        $code = $e->getCode();

        return $code === 0 ? 255 : $code;
    }

    /**
     * @param int   $offset
     * @param mixed $default
     *
     * @return  mixed|null
     */
    public function getArgument($offset, $default = null)
    {
        if (!isset($this->args[$offset])) {
            return $default;
        }

        return $this->args[$offset];
    }

    /**
     * @param int   $offset
     * @param mixed $value
     *
     * @return  static
     */
    public function setArgument($offset, $value)
    {
        $this->args[$offset] = $value;

        return $this;
    }

    /**
     * @param string|array $name
     * @param mixed        $default
     *
     * @return  mixed|null
     */
    public function getOption($name, $default = null)
    {
        $name = (array) $name;

        foreach ($name as $n) {
            if (isset($this->options[$n])) {
                return $this->options[$n];
            }
        }

        return $default;
    }

    /**
     * @param string|array $name
     * @param mixed        $value
     *
     * @return  static
     */
    public function setOption($name, $value)
    {
        $name = (array) $name;

        foreach ($name as $n) {
            $this->options[$n] = $value;
        }

        return $this;
    }

    /**
     * @param   string  $text
     * @param   boolean $nl
     *
     * @return  static
     */
    public function out($text = null, $nl = true)
    {
        fwrite(STDOUT, $text . ($nl ? "\n" : ''));

        return $this;
    }

    /**
     * @param   string  $text
     * @param   boolean $nl
     *
     * @return  static
     */
    public function err($text = null, $nl = true)
    {
        fwrite(STDERR, $text . ($nl ? "\n" : ''));

        return $this;
    }

    /**
     * @param string $ask
     * @param mixed  $default
     *
     * @return  string
     */
    public function in($ask = '', $default = null, $bool = false)
    {
        $this->out($ask, false);

        $in = rtrim(fread(STDIN, 8192), "\n\r");

        if ($bool) {
            $in = $in === '' ? $default : $in;

            return (bool) $this->mapBoolean($in);
        }

        return $in === '' ? (string) $default : $in;
    }

    /**
     * @param string $in
     *
     * @return  bool
     */
    public function mapBoolean($in)
    {
        $in = strtolower((string) $in);

        if (in_array($in, $this->booleanMapping[0], true)) {
            return false;
        }

        if (in_array($in, $this->booleanMapping[1], true)) {
            return true;
        }

        return null;
    }

    /**
     * @param   string $command
     *
     * @return  static
     */
    protected function exec($command)
    {
        $this->out('>> ' . $command);

        system($command);

        return $this;
    }

    /**
     * @param array $argv
     *
     * @return  void
     */
    protected function parseArgv($argv)
    {
        $this->executable = array_shift($argv);
        $key = null;

        $out = array();

        for ($i = 0, $j = count($argv); $i < $j; $i++) {
            $arg = $argv[$i];
            
            // --foo --bar=baz
            if (0 === strpos($arg, '--')) {
                $eqPos = strpos($arg, '=');

                // --foo
                if ($eqPos === false) {
                    $key = substr($arg, 2);

                    // --foo value
                    if ($i + 1 < $j && $argv[$i + 1][0] !== '-') {
                        $value = $argv[$i + 1];
                        $i++;
                    } else {
                        $value = isset($out[$key]) ? $out[$key] : true;
                    }

                    $out[$key] = $value;
                } else {
                    // --bar=baz
                    $key       = substr($arg, 2, $eqPos - 2);
                    $value     = substr($arg, $eqPos + 1);
                    $out[$key] = $value;
                }
            } elseif (0 === strpos($arg, '-')) {
                // -k=value -abc

                // -k=value
                if (isset($arg[2]) && $arg[2] === '=') {
                    $key       = $arg[1];
                    $value     = substr($arg, 3);
                    $out[$key] = $value;
                } else {
                    // -abc
                    $chars = str_split(substr($arg, 1));

                    foreach ($chars as $char) {
                        $key       = $char;
                        $out[$key] = isset($out[$key]) ? $out[$key] + 1 : 1;
                    }

                    // -a a-value
                    if (($i + 1 < $j) && ($argv[$i + 1][0] !== '-') && (count($chars) === 1)) {
                        $out[$key] = $argv[$i + 1];
                        $i++;
                    }
                }
            } else {
                // Plain-arg
                $this->args[] = $arg;
            }
        }

        $this->options = $out;
    }
}

class CommandArgsException extends \RuntimeException
{
}
